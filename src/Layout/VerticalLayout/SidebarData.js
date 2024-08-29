const SidebarData = [
  {
    label: "Menu",
    isMainMenu: true,
  },
  {
    label: "Dashboard",
    icon: "bx bxs-tachometer",
    url: "/dashboard",
    issubMenubadge: true,
    bgcolor: "bg-primary",
    badgeValue: "3",
  },
  {
    label: "Vehicles",
    icon: "bx bxs-car",
    subItem: [
      { sublabel: "Vehicles Listing", link: "/vehicles" },
      { sublabel: "Add Vehicle", link: "/add-vehicle" },
    ],
  },
  {
    label: "View logs",
    icon: "bx bxs-file",
    url: "/logs",
    issubMenubadge: true,
    bgcolor: "bg-primary",
    badgeValue: "1",
  },
  // {
  //   label: "View logs",
  //   icon: "bx bxs-file",
  //   subItem: [
  //     { sublabel: "Logs Listing", link: "/logs" },
  //     { sublabel: "Add Log", link: "/add-log" },
  //   ],
  // },
  {
    label: "Camera Registration",
    icon: "bx bxs-camera-plus",
    subItem: [
      { sublabel: "Camera Listing", link: "/cameras" },
      { sublabel: "Add Camera", link: "/add-camera" },
    ],
  },
  // {
  //   label: "Camera Registration",
  //   icon: "bx bxs-camera-plus",
  //   url: "/add-camera",
  //   issubMenubadge: true,
  //   bgcolor: "bg-primary",
  //   badgeValue: "1",
  // },
];
export default SidebarData;
