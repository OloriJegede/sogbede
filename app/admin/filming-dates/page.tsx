export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import FilmingDatesClient from "./FilmingDatesClient";

export default async function FilmingDatesPage() {
  const episodes = await db.episode.findMany({
    include: {
      members: {
        include: {
          application: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      },
    },
    orderBy: { shootDate: "asc" },
  });

  const serializedEpisodes = episodes.map((ep) => ({
    ...ep,
    shootDate: ep.shootDate?.toISOString() ?? null,
    createdAt: ep.createdAt?.toISOString() ?? null,
    updatedAt: ep.updatedAt?.toISOString() ?? null,
    members: ep.members.map((m) => ({
      ...m,
      createdAt: m.createdAt?.toISOString() ?? null,
    })),
  }));

  return <FilmingDatesClient episodes={serializedEpisodes} />;
}
