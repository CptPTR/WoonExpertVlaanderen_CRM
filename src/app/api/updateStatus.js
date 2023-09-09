import Status from "@/models/Status";
import { createClient } from "@supabase/supabase-js";
import cron from "node-cron";

export default async function handler(req, res) {
  const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabase = createClient(supabaseURL, supabaseKey);

  cron.schedule("* * * * *", async () => {
    const today = new Date().toISOString().split("T")[0];
    const { data, error } = await supabase
      .from("Keuring")
      .update({
        status: Status.IN_BEHANDELING,
      })
      .eq("datumPlaatsbezoek", today);

    if (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });
  return res.status(200).json({ message: "Scheduled task initiated" });
}
