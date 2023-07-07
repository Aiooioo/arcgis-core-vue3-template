declare namespace arcgis {
  export type View = typeof __esri.SceneView | typeof __esri.MapView
  export type ViewProperties =
    | __esri.SceneViewProperties
    | __esri.MapViewProperties
}
