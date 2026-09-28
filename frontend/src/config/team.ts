import React from 'react';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  badgeIcon: string;
  email: string;
  phone: string;
  gender: 'Male' | 'Female';
  photo?: string | null;
  photoCropStyle?: React.CSSProperties;
  github?: string;
  linkedin?: string;
}

export interface TeamConfig {
  teamName: string;
  teamId: string;
  collegeName: string;
  event: string;
  psId: string;
  demoMode: boolean;
  members: TeamMember[];
}

export const TEAM: TeamConfig = {
  teamName: "Team Astra-X",
  teamId: "126375",
  collegeName: "SAVEETHA INSTITUTE OF MEDICAL AND TECHNICAL SCIENCES",
  event: "Smart India Hackathon 2026",
  psId: "26092",
  demoMode: true,
  members: [
    {
      id: "varun-teja",
      name: "A.Varun Teja",
      role: "Team Leader · Full Stack Developer",
      badgeIcon: "code",
      email: "192424175.simats@saveetha.com",
      phone: "9959999429",
      gender: "Male",
      photo: "/team/varun.png",
      photoCropStyle: { objectFit: "cover", objectPosition: "center 20%", transform: "scale(1.2)" },
      github: "https://github.com/varuntej-1705",
      linkedin: "https://www.linkedin.com/in/varun-tej-arigonda-90500a349"
    },
    {
      id: "syed-thoufiq",
      name: "A Syed Thoufiq",
      role: "Backend Engineer",
      badgeIcon: "database",
      email: "192424211.simats@saveetha.com",
      phone: "8438408581",
      gender: "Male",
      photo: "/team/thoufiq.jpg",
      photoCropStyle: { objectFit: "cover", objectPosition: "center 20%" },
      github: "https://github.com/varuntej-1705",
      linkedin: "https://www.linkedin.com/in/varun-tej-arigonda-90500a349"
    },
    {
      id: "teja-sree",
      name: "V.Teja Sree",
      role: "UI/UX Designer",
      badgeIcon: "palette",
      email: "192411211.simats@saveetha.com",
      phone: "9676464857",
      gender: "Female",
      photo: "/team/tejasree.jpg",
      photoCropStyle: { objectFit: "cover", objectPosition: "center 13%", transform: "scale(1.75)" },
      github: "https://github.com",
      linkedin: "https://linkedin.com"
    },
    {
      id: "divya-shree",
      name: "P.Divya shree",
      role: "Data Analyst",
      badgeIcon: "analytics",
      email: "192472291.simats@saveetha.com",
      phone: "9502460610",
      gender: "Female",
      photo: "/team/divya.png",
      photoCropStyle: { objectFit: "cover", objectPosition: "center 20%" },
      github: "https://github.com/Divyashree7002",
      linkedin: "https://www.linkedin.com/in/divyashree-prudhivi-b14484319?utm_source=share_via&utm_content=profile&utm_medium=member_android"
    },
    {
      id: "sabitha",
      name: "V Sabitha",
      role: "ML Engineer",
      badgeIcon: "psychology",
      email: "192421415.simats@saveetha.com",
      phone: "7010670890",
      gender: "Female",
      photo: "/team/sabitha.png",
      photoCropStyle: { objectFit: "cover", objectPosition: "center 20%" },
      github: "https://github.com/Sabithavenkatesan",
      linkedin: "https://www.linkedin.com/in/sabitha-venkatesan-41101b3b0"
    },
    {
      id: "rayan-shaikh",
      name: "Mohammed Rayan Shaikh",
      role: "Full Stack Developer",
      badgeIcon: "code",
      email: "192424059.simats@saveetha.com",
      phone: "8433966553",
      gender: "Male",
      photo: "/team/rayan.png",
      photoCropStyle: { objectFit: "cover", objectPosition: "center 20%" },
      github: "https://github.com/mohdrayan01",
      linkedin: "https://www.linkedin.com/in/mohammed-rayan-shaikh-083b2639a"
    }
  ]
};
