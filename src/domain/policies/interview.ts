export function interviewDate(
  date: string,
  time: string,
  now: number,
): { date: string } | { error: string } {
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
    !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)
  )
    return { error: "Tarihi YYYY-AA-GG, saati SS:DD biçiminde girin." };
  const scheduled = new Date(`${date}T${time}:00`);
  const [year, month, day] = date.split("-").map(Number);
  if (
    !Number.isFinite(scheduled.getTime()) ||
    scheduled.getFullYear() !== year ||
    scheduled.getMonth() + 1 !== month ||
    scheduled.getDate() !== day ||
    scheduled.getTime() <= now
  )
    return { error: "Gelecekte geçerli bir tarih ve saat seçin." };
  return { date: scheduled.toISOString() };
}
