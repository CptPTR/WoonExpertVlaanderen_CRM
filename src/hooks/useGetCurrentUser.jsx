import { useEffect, useState } from "react";

const useGetCurrentUser = (supabase) => {
  const [user, setUser] = useState({});
  useEffect(() => {
    const getCurrentUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        const { data: user } = await supabase
          .from("users")
          .select("*")
          .eq("id", session.user.id)
          .single();
        setUser({
          id: user.id,
          voornaam: user.voornaam,
          familienaam: user.familienaam,
          email: user.email,
          telefoonnummer: user.telefoonnummer,
          onderneming: user.ondernemingID,
          rol: user.rol,
        });
      }
    };
    getCurrentUser();
  }, [supabase]);

  return user;
};

export default useGetCurrentUser;
