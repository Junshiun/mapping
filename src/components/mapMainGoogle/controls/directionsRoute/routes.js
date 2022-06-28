import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./routes.scss";
import "./directionDefaultIcon.scss";

export const Routes = () => {
  const location = useSelector((state) => state.location);
  const { render, routes, name } = useSelector(
    (state) => state.directionRoutes
  );

  const [renderer, setRenderer] = useState(render);
  const [navigate, setNavigate] = useState(routes);
  const [origin, setOrigin] = useState(location);
  const [showRoutes, setShowRoutes] = useState(false);

  useEffect(() => {
    setRenderer(render);
  }, [render]);

  useEffect(() => {
    setNavigate(routes);
    console.log(routes);
  }, [routes]);

  useEffect(() => {
    setOrigin(location);
    console.log(location);
  }, [location]);

  return renderer ? (
    <div className="routesDirection">
      {showRoutes ? (
        navigate.routes[0].legs[0].steps.map((step, index) => {
          return (
            <div className="eachRoute" key={"road-" + index}>
              <div className="icon">
                <div className="adp-substep">
                  <div className="adp-stepicon">
                    <div
                      className={"adp-" + step.maneuver + " adp-maneuver"}
                    ></div>
                  </div>
                </div>
              </div>
              <div
                dangerouslySetInnerHTML={{ __html: step.instructions }}
              ></div>
            </div>
          );
        })
      ) : (
        <>
          <div>From: {origin.place_address}</div>
          <div>To: {name.des}</div>
        </>
      )}
    </div>
  ) : null;
};
