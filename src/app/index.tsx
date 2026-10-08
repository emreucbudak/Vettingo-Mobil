import React from "react";
import { Redirect, Href } from "expo-router";
import { useApp } from "../state/AppProvider";
import { homeFor } from "../domain/workflows";
export default function Index() {
  const { session } = useApp();
  return (
    <Redirect href={(session ? homeFor(session.role) : "/login") as Href} />
  );
}
