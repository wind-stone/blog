import dayjs from 'dayjs';

export function formatDateTimeNew(date: number | Date, format: string) {
  return dayjs(date).format(format);
}

/** 数字转近期时间展示 */
export function formatRecentTime(time: number) {
  if (!time) {
    return null;
  }
  const current = dayjs();
  const timeDayJs = dayjs(time);
  const currentDay = current.startOf('day');
  const targetDay = timeDayJs.startOf('day');
  const dayDuration = currentDay.diff(targetDay, 'day');
  const dayTime = timeDayJs.format('HH:mm');
  if (current.isSame(timeDayJs, 'day')) {
    return '今天 ' + dayTime;
  } else if (dayDuration === 1) {
    return '昨天 ' + dayTime;
  } else if (dayDuration === 2) {
    return '前天 ' + dayTime;
  }
  return timeDayJs.format('YYYY-MM-DD HH:mm');
}
