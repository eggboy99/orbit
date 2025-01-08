import { createContext, useState } from "react";
import PropTypes from "prop-types";

const MobileMenuContext = createContext();

export const MobileMenuContextProvider = ({ children }) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <MobileMenuContext.Provider value={{ isActive, setIsActive }}>
      {children}
    </MobileMenuContext.Provider>
  );
};

MobileMenuContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MobileMenuContext;
