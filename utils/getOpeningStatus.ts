import type { OpeningHours } from '@/types/store';

export type OpeningStatus = { isOpen: true; to: string } | { isOpen: false; tomorrowOpenTime: string };

export function getOpeningStatus(openinghours: OpeningHours): OpeningStatus {
  const now = new Date();
  const dayIndex = now.getDay(); // 0 = Sunday, ..., 6 = Saturday
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const todayKey = days[dayIndex];
  const today = openinghours[todayKey as keyof OpeningHours];

  if (!today || !today.opensAt || !today.closesAt) {
    return getNextOpenTime();
  }

  const [openHour, openMinute] = today.opensAt.split('+')[0].split(':').map(Number);
  const [closeHour, closeMinute] = today.closesAt.split('+')[0].split(':').map(Number);

  const openTime = new Date(now);
  openTime.setHours(openHour, openMinute, 0, 0);

  const closeTime = new Date(now);
  closeTime.setHours(closeHour, closeMinute, 0, 0);

  if (now >= openTime && now <= closeTime) {
    return { isOpen: true, to: today.closesAt.split('+')[0] };
  }

  return getNextOpenTime();

  function getNextOpenTime(): { isOpen: false; tomorrowOpenTime: string } {
    for (let i = 1; i <= 7; i++) {
      const nextIndex = (dayIndex + i) % 7;
      const nextKey = days[nextIndex];
      const nextDay = openinghours[nextKey as keyof OpeningHours];
      if (nextDay && nextDay.opensAt) {
        return {
          isOpen: false,
          tomorrowOpenTime: nextDay.opensAt.split('+')[0],
        };
      }
    }
    // fallback: no available time
    return { isOpen: false, tomorrowOpenTime: 'Closed' };
  }
}
