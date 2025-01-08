import { useLocation } from "react-router-dom";

// Helper component to display the current pathname
const PathnameDisplay = () => {
  const location = useLocation();
  return <div data-testid="current-path">{location.pathname}</div>;
};

export default PathnameDisplay;
