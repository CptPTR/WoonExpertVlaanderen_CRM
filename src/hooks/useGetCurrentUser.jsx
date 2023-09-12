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
          .select(
            "id, email, voornaam, familienaam, telefoonnummer, email, Onderneming(naam), rol, specfield"
          )
          .eq("id", session.user.id)
          .single();
        setUser({
          id: user.id,
          voornaam: user.voornaam,
          familienaam: user.familienaam,
          email: user.email,
          telefoonnummer: user.telefoonnummer,
          onderneming: user.Onderneming.naam,
          rol: user.rol,
          specfield: user.specfield,
        });
      }
    };
    getCurrentUser();
  }, [supabase]);

  return user;
};

export default useGetCurrentUser;
