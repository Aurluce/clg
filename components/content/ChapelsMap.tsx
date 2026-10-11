"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export type ChapelLocation = {
  id: string;
  slug: string;
  name: string;
  address: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
};

type Coordinates = [number, number];
type WalkingStep = {
  instruction: string;
  distance: number;
  duration: number;
};

type Props = {
  chapels: ChapelLocation[];
  selectedSlug: string | null;
  onSelectChapel: (slug: string | null) => void;
};

const userIcon = L.divIcon({
  className: "",
  html: '<div style="width:18px;height:18px;border-radius:50%;background:#2563eb;border:4px solid white;box-shadow:0 0 0 5px #2563eb40"></div>',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

const chapelIcon = L.divIcon({
  className: "",
  html: '<div style="width:30px;height:30px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:#b91c1c;border:2px solid white;box-shadow:0 2px 6px #0005"><div style="transform:rotate(45deg);color:white;text-align:center;font-size:17px;line-height:26px">✝</div></div>',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

function FollowPosition({ position }: { position: Coordinates | null }) {
  const map = useMap();

  useEffect(() => {
    if (position) map.panTo(position, { animate: true, duration: 0.5 });
  }, [position, map]);

  return null;
}

function FitLocations({ locations }: { locations: Coordinates[] }) {
  const map = useMap();
  const fitted = useRef(false);

  useEffect(() => {
    if (fitted.current || locations.length === 0) return;
    fitted.current = true;
    if (locations.length === 1) map.setView(locations[0], 14);
    else map.fitBounds(L.latLngBounds(locations), { padding: [40, 40], maxZoom: 13 });
  }, [locations, map]);

  return null;
}

function FocusChapel({ chapel }: { chapel: ChapelLocation | null }) {
  const map = useMap();

  useEffect(() => {
    if (chapel) {
      map.flyTo([chapel.latitude, chapel.longitude], Math.max(map.getZoom(), 14), { duration: 0.8 });
    }
  }, [chapel, map]);

  return null;
}

function distanceBetween(a: Coordinates, b: Coordinates): number {
  const toRad = (degrees: number) => (degrees * Math.PI) / 180;
  const earthRadius = 6_371_000;
  const dLat = toRad(b[0] - a[0]);
  const dLon = toRad(b[1] - a[1]);
  const lat1 = toRad(a[0]);
  const lat2 = toRad(b[0]);
  const haversine =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * earthRadius * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

function instructionFor(step: {
  name?: string;
  maneuver?: { type?: string; modifier?: string };
}): string {
  const type = step.maneuver?.type ?? "continue";
  const modifier = step.maneuver?.modifier;
  const street = step.name ? ` sur ${step.name}` : "";
  const directions: Record<string, string> = {
    left: "à gauche",
    right: "à droite",
    "slight left": "légèrement à gauche",
    "slight right": "légèrement à droite",
    "sharp left": "franchement à gauche",
    "sharp right": "franchement à droite",
    straight: "tout droit",
    uturn: "faites demi-tour",
  };

  if (type === "arrive") return "Vous êtes arrivé à destination.";
  if (type === "depart") return `Partez${street}.`;
  if (type === "roundabout" || type === "rotary") return `Au rond-point, prenez la sortie indiquée${street}.`;
  if (type === "turn" || type === "end of road" || type === "fork") {
    return `Tournez ${directions[modifier ?? ""] ?? "dans la direction indiquée"}${street}.`;
  }
  if (type === "new name" || type === "continue" || type === "merge") return `Continuez tout droit${street}.`;
  if (type === "on ramp" || type === "off ramp") return `Prenez la voie indiquée${street}.`;
  return `Continuez${street}.`;
}

function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} km`;
}

function formatDuration(seconds: number): string {
  const minutes = Math.max(1, Math.round(seconds / 60));
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return remaining ? `${hours} h ${remaining} min` : `${hours} h`;
}

export default function ChapelsMap({ chapels, selectedSlug, onSelectChapel }: Props) {
  const [position, setPosition] = useState<Coordinates | null>(null);
  const [error, setError] = useState(() =>
    typeof navigator !== "undefined" && !("geolocation" in navigator)
      ? "La géolocalisation n'est pas disponible dans ce navigateur."
      : "",
  );
  const [locationState, setLocationState] = useState(() =>
    typeof navigator !== "undefined" && "geolocation" in navigator
      ? "Autorisez la géolocalisation pour démarrer"
      : "GPS indisponible",
  );
  const [following, setFollowing] = useState(false);
  const [route, setRoute] = useState<Coordinates[]>([]);
  const [steps, setSteps] = useState<WalkingStep[]>([]);
  const [routeDistance, setRouteDistance] = useState<number | null>(null);
  const [routeDuration, setRouteDuration] = useState<number | null>(null);
  const [isRouting, setIsRouting] = useState(false);
  const lastRouted = useRef<{ position: Coordinates; chapelId: string; at: number } | null>(null);
  const routeController = useRef<AbortController | null>(null);

  const validChapels = useMemo(
    () => chapels.filter(
      (chapel) => Number.isFinite(chapel.latitude) &&
        Number.isFinite(chapel.longitude) &&
        Math.abs(chapel.latitude) <= 90 &&
        Math.abs(chapel.longitude) <= 180,
    ),
    [chapels],
  );
  const locations = useMemo(
    () => validChapels.map((chapel) => [chapel.latitude, chapel.longitude] as Coordinates),
    [validChapels],
  );
  const selected = useMemo(
    () => validChapels.find((chapel) => chapel.slug === selectedSlug) ?? null,
    [selectedSlug, validChapels],
  );
  const center: Coordinates = position ?? locations[0] ?? [3.848, 11.502];

  useEffect(() => {
    if (!("geolocation" in navigator)) return;
    const watchId = navigator.geolocation.watchPosition(
      (result) => {
        const currentPosition: Coordinates = [result.coords.latitude, result.coords.longitude];
        setPosition(currentPosition);
        setLocationState(`Position actualisée · précision ±${Math.round(result.coords.accuracy)} m`);
        setError("");
      },
      (geoError) => {
        setError(
          geoError.code === 1
            ? "Autorisez la localisation dans votre navigateur pour afficher votre position et calculer un itinéraire."
            : "Position GPS indisponible. Vérifiez le GPS et la connexion Internet.",
        );
        setLocationState("Position indisponible");
      },
      { enableHighAccuracy: true, maximumAge: 3000, timeout: 15000 },
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
      routeController.current?.abort();
    };
  }, []);

  useEffect(() => {
    if (!position || !selected) {
      lastRouted.current = null;
      return;
    }

    const previous = lastRouted.current;
    const movedMeters = previous && previous.chapelId === selected.id
      ? distanceBetween(previous.position, position)
      : Number.POSITIVE_INFINITY;
    const elapsed = previous ? Date.now() - previous.at : Number.POSITIVE_INFINITY;
    if (movedMeters < 25) return;

    const delay = Math.max(0, 5000 - elapsed);
    const timeout = window.setTimeout(async () => {
      routeController.current?.abort();
      const controller = new AbortController();
      routeController.current = controller;
      lastRouted.current = { position, chapelId: selected.id, at: Date.now() };
      setIsRouting(true);
      setError("");

      const coordinates = `${position[1]},${position[0]};${selected.longitude},${selected.latitude}`;
      const url = `https://routing.openstreetmap.de/routed-foot/route/v1/driving/${coordinates}?overview=full&geometries=geojson&steps=true&alternatives=false`;

      try {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) throw new Error("Le calcul de l'itinéraire à pied est indisponible. Réessayez dans un instant.");
        const data = await response.json() as {
          code?: string;
          routes?: Array<{
            distance: number;
            duration: number;
            geometry: { coordinates: [number, number][] };
            legs: Array<{ steps: Array<{ distance: number; duration: number; name?: string; maneuver?: { type?: string; modifier?: string } }> }>;
          }>;
        };
        const result = data.routes?.[0];
        if (data.code !== "Ok" || !result) throw new Error("Aucun chemin piéton n'a été trouvé pour cette destination.");
        setRoute(result.geometry.coordinates.map(([longitude, latitude]) => [latitude, longitude]));
        setRouteDistance(result.distance);
        setRouteDuration(result.duration);
        setSteps(result.legs.flatMap((leg) => leg.steps.map((step) => ({
          instruction: instructionFor(step),
          distance: step.distance,
          duration: step.duration,
        }))));
      } catch (routeError) {
        if (routeError instanceof Error && routeError.name !== "AbortError") {
          setError(routeError.message);
          setRoute([]);
          setSteps([]);
        }
      } finally {
        if (!controller.signal.aborted) setIsRouting(false);
      }
    }, delay);

    return () => window.clearTimeout(timeout);
  }, [position, selected]);

  function selectChapel(chapel: ChapelLocation) {
    routeController.current?.abort();
    setIsRouting(false);
    onSelectChapel(chapel.slug);
    setFollowing(false);
    setRoute([]);
    setSteps([]);
    lastRouted.current = null;
    if (!position) {
      setError("Autorisez la géolocalisation. L'itinéraire piéton sera calculé dès que votre position sera détectée.");
    }
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-royal-100 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5">
        <div>
          <h2 className="font-display text-xl font-semibold text-royal">Carte des chapelles CLG</h2>
          <p className="mt-1 text-sm text-slate">{validChapels.length} chapelle(s) avec coordonnées · carte actualisée avec le GPS</p>
        </div>
        <button
          type="button"
          onClick={() => {
            if (position) {
              setFollowing(true);
              setError("");
            } else {
              setError("En attente de la position GPS. Vérifiez l'autorisation de localisation du navigateur.");
            }
          }}
          className="rounded-xl bg-royal px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-royal-700"
        >
          Centrer sur ma position
        </button>
      </div>

      <div className="flex items-center gap-2 border-y border-royal-50 bg-paper-light px-4 py-2.5 text-xs text-slate">
        <span className={`h-2.5 w-2.5 rounded-full ${position ? "animate-pulse bg-emerald-500" : "bg-amber-400"}`} aria-hidden="true" />
        <span>{locationState}</span>
      </div>

      {error && <p role="status" className="px-4 py-3 text-sm text-crimson-700">{error}</p>}
      {chapels.length === 0 && (
        <p className="px-4 py-3 text-sm text-slate">La carte est prête. Les marqueurs apparaîtront dès que les chapelles auront été ajoutées dans l’administration.</p>
      )}
      {chapels.length !== validChapels.length && (
        <p className="px-4 pt-3 text-xs text-amber-800">{chapels.length - validChapels.length} chapelle(s) n&apos;ont pas encore de coordonnées GPS renseignées par l&apos;administration.</p>
      )}

      <MapContainer center={center} zoom={validChapels.length > 1 ? 6 : 13} scrollWheelZoom className="h-[430px] w-full sm:h-[560px]">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitLocations locations={locations} />
        <FocusChapel chapel={selected} />
        {following && position && <FollowPosition position={position} />}
        {position && <Marker position={position} icon={userIcon}><Popup>Votre position actuelle</Popup></Marker>}
        {validChapels.map((chapel) => (
          <Marker
            key={chapel.id}
            position={[chapel.latitude, chapel.longitude]}
            icon={chapelIcon}
            eventHandlers={{ click: () => selectChapel(chapel) }}
          >
            <Popup>
              <strong>{chapel.name}</strong><br />
              {[chapel.address, chapel.city, chapel.country].filter(Boolean).join(", ")}<br />
              <button type="button" onClick={() => selectChapel(chapel)} style={{ marginTop: 8, padding: "8px 12px", borderRadius: 8, background: "#1e3a8a", color: "white", cursor: "pointer" }}>
                Itinéraire à pied
              </button>
            </Popup>
          </Marker>
        ))}
        {route.length > 1 && <Polyline positions={route} pathOptions={{ color: "#2563eb", weight: 6, opacity: 0.85 }} />}
      </MapContainer>

      <div className="grid gap-5 p-4 sm:p-5 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <div>
          {selected ? (
            <>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-crimson">Destination</p>
              <h3 className="mt-2 font-display text-xl font-semibold text-royal">{selected.name}</h3>
              <p className="mt-1 text-sm text-slate">{[selected.address, selected.city, selected.country].filter(Boolean).join(", ")}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-royal-50 px-3 py-1.5 text-sm font-semibold text-royal-800">{routeDistance === null ? "Distance en calcul" : formatDistance(routeDistance)}</span>
                <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-800">{routeDuration === null ? "Durée estimée" : formatDuration(routeDuration)}</span>
              </div>
              <p className="mt-3 text-xs leading-5 text-slate-500">Itinéraire piéton calculé depuis votre GPS avec les données OpenStreetMap. Le trajet se recalcule si vous vous déplacez.</p>
              <a
                href={`https://www.google.com/maps/dir/?api=1&origin=${position?.join(",") ?? ""}&destination=${selected.latitude},${selected.longitude}&travelmode=walking`}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex rounded-xl border border-royal-100 px-4 py-2.5 text-sm font-semibold text-royal-700 hover:bg-royal-50"
              >
                Ouvrir la navigation externe ↗
              </a>
            </>
          ) : (
            <div className="flex h-full min-h-36 flex-col justify-center rounded-xl bg-paper-light p-5">
              <p className="font-semibold text-royal">Choisissez une chapelle</p>
              <p className="mt-2 text-sm leading-6 text-slate">Sélectionnez un marqueur pour afficher un itinéraire piéton et les indications étape par étape.</p>
            </div>
          )}
        </div>

        <div className="min-w-0">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-semibold text-royal-900">Itinéraire à pied</h3>
            {isRouting && <span role="status" className="text-xs text-slate">Calcul du trajet…</span>}
          </div>
          {steps.length ? (
            <ol className="mt-3 max-h-64 space-y-2 overflow-y-auto pr-1">
              {steps.map((step, index) => (
                <li key={`${index}-${step.instruction}`} className="flex gap-3 rounded-xl bg-paper-light p-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-royal text-xs font-bold text-white">{index + 1}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-charcoal">{step.instruction}</p>
                    {step.distance > 0 && <p className="mt-1 text-xs text-slate">{formatDistance(step.distance)} · env. {formatDuration(step.duration)}</p>}
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <p className="mt-3 rounded-xl border border-dashed border-royal-100 px-4 py-5 text-sm leading-6 text-slate">
              {selected ? "Les étapes de marche s'afficheront dès que le GPS et le calcul du trajet seront disponibles." : "Sélectionnez une destination pour obtenir les indications de marche."}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
