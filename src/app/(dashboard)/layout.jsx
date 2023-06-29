"use client";

import styles from "@/app/(dashboard)/layout.module.css";
import Image from "next/image";

import Logo from "@/assets/images/WEV_LOGO.svg";
import useGetCurrentUser from "@/hooks/useGetCurrentUser";
import { Avatar, Box, Button } from "@chakra-ui/react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Roboto } from "next/font/google";
import { useRouter } from "next/navigation";
import { FaClipboardCheck } from "react-icons/fa";

const roboto400 = Roboto({ subsets: ["latin"], weight: "400" });
const roboto900 = Roboto({ subsets: ["latin"], weight: "900" });

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const supabase = createClientComponentClient({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });

  const user = useGetCurrentUser(supabase);

  const handleBtnClick = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log(error);
    } else {
      window.location.href = "/login";
    }
  };

  return (
    <div className={styles.dashboard}>
      <nav className={styles.sidemenu}>
        <div>
          <div className={styles.logo}>
            <Image
              width={175}
              src={Logo}
              alt="Logo WoonExpertVlaanderen"
              priority
            />
          </div>
          <ul>
            <li
              onClick={() => router.push("/keuringen")}
              style={{ cursor: "pointer" }}
            >
              <FaClipboardCheck size={24} style={{ marginRight: "25px" }} />
              Keuringen
            </li>
          </ul>
        </div>
        <div>
          <Box ml="20px">
            <Button onClick={handleBtnClick}>Uitloggen</Button>
          </Box>
          <div className={styles.profile}>
            <Avatar
              text={`${user.voornaam} ${user.familienaam}`}
              size={"md"}
              color={"gradient"}
              textColor={"white"}
            />
            <div className={styles.userInfo}>
              <span className={roboto900.className}>
                {user.voornaam} {user.familienaam}
              </span>

              <span className={roboto400.className}>{user.rol}</span>
            </div>
          </div>
        </div>
      </nav>
      {children}
    </div>
  );
}
