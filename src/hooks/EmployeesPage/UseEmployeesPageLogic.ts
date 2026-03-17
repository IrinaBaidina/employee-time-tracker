import { useState } from "react";

export const useEmployeesPageLogic = () => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    lastName: "",
    department: "",
  });

  // Переключение поиска
  const toggleSearch = () => {
    setIsSearchVisible((prev) => !prev);
    if (isSearchVisible) setSearchTerm("");
  };

  // Обновление значений фильтра
  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Сброс фильтров
  const resetFilters = () => {
    setFilters({ lastName: "", department: "" });
  };

  return {
    isSearchVisible,
    searchTerm,
    filters,
    setSearchTerm,
    toggleSearch,
    handleFilterChange,
    resetFilters,
  };
};