import React from "react";
import { Redirect, Href } from "expo-router";
import { useApp } from "../core/presentation/state/AppProvider";
import { homeFor } from "../features/auth/presentation/navigation/routes";
export default function Index() {
  const { session } = useApp();
  return (
    <Redirect href={(session ? homeFor(session.role) : "/login") as Href} />
  );
}
