// src/contexts/OrderContext.js
import { createContext, useContext, useState } from "react";

const OrderContext = createContext();

export const useOrderContext = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
  const [refreshFlag, setRefreshFlag] = useState(false);

  const triggerRefresh = () => {
    setRefreshFlag((prev) => !prev); // Đảo để useEffect phụ thuộc kích hoạt
  };

  return (
    <OrderContext.Provider value={{ refreshFlag, triggerRefresh }}>
      {children}
    </OrderContext.Provider>
  );
};
