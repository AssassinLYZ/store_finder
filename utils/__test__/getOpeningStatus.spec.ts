import { describe, it, expect, afterEach } from 'vitest';
import { getOpeningStatus } from '../getOpeningStatus';
import type { OpeningHours } from '@/types/store';

describe('getOpeningStatus', () => {
  const RealDate = Date;

  function mockDate(dateString: string) {
    global.Date = class extends RealDate {
      constructor() {
        super();
        return new RealDate(dateString);
      }
      static override now() {
        return new RealDate(dateString).getTime();
      }
      static override parse(dateStr: string) {
        return RealDate.parse(dateStr);
      }
    } as DateConstructor;
  }

  afterEach(() => {
    global.Date = RealDate;
  });

  const fullOpeningHours: OpeningHours = {
    sunday: { opensAt: '', closesAt: '' },
    monday: { opensAt: '', closesAt: '' },
    tuesday: { opensAt: '', closesAt: '' },
    wednesday: { opensAt: '09:00', closesAt: '18:00' },
    thursday: { opensAt: '09:00', closesAt: '18:00' },
    friday: { opensAt: '', closesAt: '' },
    saturday: { opensAt: '', closesAt: '' },
  };

  it('returns isOpen true when current time is within open hours', () => {
    mockDate('2024-07-03T10:00:00'); // Wed 10:00
    const status = getOpeningStatus(fullOpeningHours);
    expect(status.isOpen).toBe(true);
    if (status.isOpen) {
      expect(status.to).toBe('18:00');
    }
  });

  it('returns isOpen false and next open time when current time is before open hours', () => {
    mockDate('2024-07-03T08:00:00'); // Wed 08:00
    const status = getOpeningStatus(fullOpeningHours);
    expect(status.isOpen).toBe(false);
    if (!status.isOpen) {
      expect(status.tomorrowOpenTime).toBe('09:00');
    }
  });

  it('returns isOpen false and next open time on another day if today closed', () => {
    mockDate('2024-07-03T20:00:00'); // Wed 20:00, after close
    const status = getOpeningStatus(fullOpeningHours);
    expect(status.isOpen).toBe(false);
    if (!status.isOpen) {
      expect(status.tomorrowOpenTime).toBe('09:00');
    }
  });

  it('returns "Closed" when no opening hours in a whole week', () => {
    mockDate('2024-07-03T10:00:00');
    const emptyHours: OpeningHours = {
      sunday: { opensAt: '', closesAt: '' },
      monday: { opensAt: '', closesAt: '' },
      tuesday: { opensAt: '', closesAt: '' },
      wednesday: { opensAt: '', closesAt: '' },
      thursday: { opensAt: '', closesAt: '' },
      friday: { opensAt: '', closesAt: '' },
      saturday: { opensAt: '', closesAt: '' },
    };
    const status = getOpeningStatus(emptyHours);
    expect(status.isOpen).toBe(false);
    if (!status.isOpen) {
      expect(status.tomorrowOpenTime).toBe('Closed');
    }
  });
});
