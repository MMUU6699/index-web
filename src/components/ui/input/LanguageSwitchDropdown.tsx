"use client";

import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/react";
import { useEffect, useState } from "react";
import { IoLanguage } from "react-icons/io5";
import useLanguage, { Language } from "@/hooks/useLanguage";
import { useQueryClient } from "@tanstack/react-query";

const languages: { code: Language; label: string; flag: string }[] = [
  { code: "en-US", label: "English", flag: "🇺🇸" },
  { code: "ar-SA", label: "العربية", flag: "🇸🇦" },
];

const LanguageSwitchDropdown = () => {
  const { language, setLanguage } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    queryClient.invalidateQueries();
  };

  return (
    <Dropdown
      showArrow
      classNames={{
        content: "min-w-fit",
      }}
    >
      <DropdownTrigger>
        <Button isIconOnly variant="light" className="p-2">
          <IoLanguage className="size-full" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        disallowEmptySelection
        selectionMode="single"
        selectedKeys={[language]}
      >
        {languages.map(({ code, label, flag }) => (
          <DropdownItem
            key={code}
            textValue={label}
            onPress={() => handleLanguageChange(code)}
          >
            <div className="flex items-center gap-2 pr-2">
              <span>{flag}</span>
              <p>{label}</p>
            </div>
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

export default LanguageSwitchDropdown;
