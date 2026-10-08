import React from "react";
import { Redirect, Href } from "expo-router";
import { useApp } from "../presentation/state/AppProvider";
import { homeFor } from "../presentation/navigation/routes";
export default function Index() {
  const { session } = useApp();
  return (
    <Redirect href={(session ? homeFor(session.role) : "/login") as Href} />
  );
}
