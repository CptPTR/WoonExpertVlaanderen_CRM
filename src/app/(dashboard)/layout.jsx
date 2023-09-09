"use client";

import styles from "@/app/(dashboard)/layout.module.css";
import Logo from "@/assets/images/WEV_LOGO.svg";
import useGetCurrentUser from "@/hooks/useGetCurrentUser";
import { Avatar, Box, Button, Skeleton, Text } from "@chakra-ui/react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Roboto } from "next/font/google";
import Image from "next/image";

const roboto400 = Roboto({ subsets: ["latin"], weight: "400" });
const roboto900 = Roboto({ subsets: ["latin"], weight: "900" });

export default function DashboardLayout({ children }) {
  const supabase = createClientComponentClient({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });

  const user = useGetCurrentUser(supabase);

  const userInfo = `${user.specfield} ${user.rol}`;

  const handleBtnClick = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Unable to sign out: ", error);
    } else {
      window.location.href = "/login";
    }
  };

  return (
    <div className={styles.layout}>
      <header>
        <nav className={styles.navigation}>
          <Box display="flex" alignItems="center">
            <Image
              width={150}
              src={Logo}
              alt="Logo WoonExpertVlaanderen"
              priority
            />
          </Box>
          <Box display="flex" alignItems="center">
            <Box>
              <Button onClick={handleBtnClick}>Uitloggen</Button>
            </Box>
            <Box display="flex" alignItems="center" ml={5}>
              <Box display="flex" flexDirection="column" alignItems="flex-end">
                <Text fontSize="sm" className={roboto900.className}>
                  {user.voornaam} {user.familienaam}
                </Text>
                <Text fontSize="x-small" className={roboto400.className}>
                  {userInfo}
                </Text>
              </Box>
              <Avatar
                mx={3}
                text={`${user.voornaam} ${user.familienaam}`}
                size={"sm"}
                color={"gradient"}
                textColor={"white"}
              />
            </Box>
          </Box>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
}
