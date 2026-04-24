-- Allow public updates to confirmed teams for QR Attendance scanning so the scanner can mark attendance.
DROP POLICY IF EXISTS teams_update_attendance_admin ON public.teams;
CREATE POLICY teams_update_attendance_admin
ON public.teams
FOR UPDATE
USING (
  status = 'confirmed'
);
