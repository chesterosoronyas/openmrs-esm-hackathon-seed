import React from "react";
import ReactDOM from "react-dom";
import singleSpaReact from "single-spa-react";
import diagnosisInfoParcel from "./root.component";
import "./global.css";
import "./set-public-path";

const lifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: diagnosisInfoParcel
});

export const bootstrap = lifecycles.bootstrap;
export const mount = lifecycles.mount;
export const unmount = lifecycles.unmount;
