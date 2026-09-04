"use client";

import React, { useEffect, useState } from "react";
import { Clock, MapPin, Volume2 } from "lucide-react";
import { getTodayPrayerTimes, type PrayerTimesSchedule } from "../services/prayer-time-service";

export interface PrayerTimesWidgetProps {
  initialSchedule: PrayerTimesSchedule;
}

export function PrayerTimesWidget({ initialSchedule }: PrayerTimesWidgetProps) {
  const [schedule, setSchedule] = useState<PrayerTimesSchedule>(initialSchedule);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
      setSchedule(getTodayPrayerTimes(now));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const hoursRemaining = Math.floor(schedule.nextPrayer.minutesRemaining / 60);
  const minsRemaining = schedule.nextPrayer.minutesRemaining % 60;

  const prayerCards = [
    { name: "Subuh", time: schedule.timings.subuh },
    { name: "Terbit", time: schedule.timings.terbit },
    { name: "Dzuhur", time: schedule.timings.dzuhur },
    { name: "Ashar", time: schedule.timings.ashar },
    { name: "Maghrib", time: schedule.timings.maghrib },
    { name: "Isya", time: schedule.timings.isya },
  ];

  return (
    <div className="overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card to-muted/30 p-4 sm:p-6 lg:p-8 shadow-sm">
      {/* Header Widget */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div className="min-w-0 space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <MapPin className="size-3.5" />
            <span>{schedule.location}</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Jadwal Salat Hari Ini
          </h2>
          <p className="text-xs text-muted-foreground">
            {schedule.date} {currentTime ? `· Pukul ${currentTime} WIB ` : " "}· <span className="text-amber-700 dark:text-amber-400 font-medium">{schedule.hijri}</span>
          </p>
        </div>

        {/* Live Clock & Next Prayer Counter */}
        <div className="flex w-full sm:w-auto items-center gap-3 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-2.5 dark:bg-primary/10">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
            <Clock className="size-4.5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Salat Berikutnya
            </p>
            <p className="text-sm font-bold text-foreground">
              {schedule.nextPrayer.name}{" "}
              <span className="text-primary">({schedule.nextPrayer.time} WIB)</span>
            </p>
            <p className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
              {schedule.nextPrayer.isAdzanNow ? (
                <span className="flex items-center gap-1 font-bold text-emerald-600 animate-pulse">
                  <Volume2 className="size-3" /> Waktu Salat Telah Tiba
                </span>
              ) : (
                `Sisa waktu: ${hoursRemaining > 0 ? `${hoursRemaining} jam ` : ""}${minsRemaining} menit`
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Grid 6 Waktu Salat */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {prayerCards.map((p) => {
          const isNext = p.name.toLowerCase() === schedule.nextPrayer.name.toLowerCase();
          return (
            <div
              key={p.name}
              className={`group relative flex flex-col items-center justify-center rounded-2xl border p-4 transition-all duration-300 ${
                isNext
                  ? "border-primary bg-primary text-white shadow-md sm:scale-[1.02] ring-2 ring-primary ring-offset-2 ring-offset-background"
                  : "border-border/60 bg-card hover:border-primary/40 hover:bg-muted/30"
              }`}
            >
              {isNext && (
                <span className="absolute -top-2.5 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-950 shadow-sm">
                  Aktif
                </span>
              )}
              <span
                className={`text-xs font-semibold tracking-wider uppercase ${
                  isNext ? "text-white/80" : "text-muted-foreground"
                }`}
              >
                {p.name}
              </span>
              <span
                className={`mt-1 font-mono text-2xl font-extrabold tracking-tight ${
                  isNext ? "text-white" : "text-foreground"
                }`}
              >
                {p.time}
              </span>
              <span
                className={`mt-1 text-[10px] ${
                  isNext ? "text-white/70" : "text-muted-foreground"
                }`}
              >
                WIB
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

