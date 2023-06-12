"use client";

import Image from "next/image";
import styles from "./layout.module.css";

import Logo from "@/assets/images/wev_logo.png";
import { Avatar } from "@nextui-org/react";
import { FaClipboardCheck } from "react-icons/fa";
import { Roboto } from "next/font/google";

const roboto400 = Roboto({ subsets: ["latin"], weight: "400" });
const roboto900 = Roboto({ subsets: ["latin"], weight: "900" });

export default function DashboardLayout({ children }) {
  return (
    <div className={styles.dashboard}>
      <nav className={styles.sidemenu}>
        <div>
          <div className={styles.logo}>
            <Image
              width={225}
              src={Logo}
              alt="Logo WoonExpertVlaanderen"
              priority
            />
          </div>
          <ul>
            <li>
              <FaClipboardCheck size={24} style={{ marginRight: "25px" }} />
              Keuringen
            </li>
          </ul>
        </div>
        <div className={styles.profile}>
          <Avatar text="B" size={"md"} color={"gradient"} textColor={"white"} />
          <div className={styles.userInfo}>
            <span className={roboto900.className}>Bob</span>
            <span className={roboto400.className}>Energiedeskundige</span>
          </div>
        </div>
      </nav>
      {children}
    </div>
  );
}
