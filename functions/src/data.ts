import { db } from "./firebase";
import * as admin from "firebase-admin";

export interface DocumentData {
  __id__: string;
}

export interface Region extends DocumentData {
  name: string;
}

export interface Location extends DocumentData {
  name?: string;
  address?: string;
  tel?: string;
  website?: string;
  featured?: boolean;
  featuredImage?: string;
  featuredImageUri?: string;

  urls?: {
    google?: string;
  };
  ids?: {
    google?: string;
  };
  coordinates?: {
    lat: number;
    lng: number;
  };
  fetched?: number;
}

export interface Room extends DocumentData {
  name: string;
  location?: string;
  slug?: string;
  region?: string;
  reviewCount: number;
  reviewScore: number;
  difficulty?: number;
  duration?: number;
  description?: string;
  playersMin?: number;
  playersMax?: number;
}

export interface Review extends DocumentData {
  location?: string;
  date?: Date;
  escaped?: boolean;
  players?: number;
  recommended?: boolean;
  uid?: string;
}

function snapToData(snap: admin.firestore.DocumentSnapshot): any {
  return Object.assign({ __id__: snap.id }, snap.data());
}

async function queryToData<T>(query): Promise<T> {
  const snap = await query.get();
  return snap.docs.map(doc => snapToData(doc));
}

export async function getRegion(regionId: string): Promise<Region> {
  return snapToData(
    await db
      .collection("regions")
      .doc(regionId)
      .get()
  );
}

export function getRegions(): Promise<Region[]> {
  return queryToData<Region[]>(db.collection("regions").orderBy("name"));
}

export async function getRegionLocations(region: string): Promise<Location[]> {
  const locations = await queryToData<Location[]>(
    db
      .collection("locations")
      .where("region", "==", region)
      .orderBy("name")
  );

  return locations.sort((a: Location, b: Location): number => {
    if (a.featured && !b.featured) {
      return -1;
    } else if (b.featured && !a.featured) {
      return 1;
    }
    return a.name < b.name ? -1 : 1;
  });
}

export function getRegionRooms(region: string): Promise<Room[]> {
  return queryToData<Room[]>(
    db
      .collection("rooms")
      .where("region", "==", region)
      .orderBy("location")
  );
}

export async function regionPageData(rid: string): Promise<{ region: Region; locations: Location[]; rooms: Room[] }> {
  const t0 = Date.now();
  const [region, locations, rooms] = await Promise.all([getRegion(rid), getRegionLocations(rid), getRegionRooms(rid)]);
  console.log("RegionPage data fetch time:", Date.now() - t0, "ms");
  return { region, locations, rooms };
}
