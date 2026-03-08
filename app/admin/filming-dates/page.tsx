export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import FilmingDatesClient from "./FilmingDatesClient";

export default async function FilmingDatesPage() {
  const [calendarDates, episodes] = await Promise.all([
    db.filmingCalendar.findMany({
      orderBy: { date: "asc" },
    }),
    db.episode.findMany({
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
    }),
  ]);

  // Count applications booked for each calendar date
  const bookingCounts = await Promise.all(
    calendarDates.map(async (cd) => {
      const count = await db.application.count({
        where: { filmingDate: cd.date },
      });
      return { dateId: cd.id, count };
    }),
  );

  const bookingMap = Object.fromEntries(
    bookingCounts.map((b) => [b.dateId, b.count]),
  );

  const serializedDates = calendarDates.map((d) => ({
    ...d,
    date: d.date.toISOString(),
    createdAt: d.createdAt?.toISOString() ?? null,
    updatedAt: d.updatedAt?.toISOString() ?? null,
    bookedCount: bookingMap[d.id] ?? 0,
  }));

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

  return (
    <FilmingDatesClient
      calendarDates={serializedDates}
      episodes={serializedEpisodes}
    />
  );
}
