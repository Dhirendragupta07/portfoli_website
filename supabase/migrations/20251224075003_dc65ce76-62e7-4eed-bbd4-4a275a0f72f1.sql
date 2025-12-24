-- Create a function to check rate limiting for contact submissions
CREATE OR REPLACE FUNCTION public.check_contact_rate_limit(sender_email text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT (
    SELECT COUNT(*)
    FROM public.contact_messages
    WHERE email = sender_email
      AND created_at > now() - interval '1 hour'
  ) < 3  -- Max 3 messages per hour per email
$$;

-- Drop the old permissive INSERT policy
DROP POLICY IF EXISTS "Anyone can submit contact messages" ON public.contact_messages;

-- Create a new INSERT policy with rate limiting
CREATE POLICY "Rate limited contact submissions"
ON public.contact_messages
FOR INSERT
TO anon, authenticated
WITH CHECK (
  public.check_contact_rate_limit(email)
);