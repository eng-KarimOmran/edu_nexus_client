import { Checkbox } from "../ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { SetURLSearchParams } from "react-router-dom";

export interface TableFilterProps {
  data: {
    group: string;
    option: {
      label: string;
      key: string;
      val: string;
    }[];
  }[];
}

export default function TableFilter({
  searchParams,
  setSearchParams,
  data,
}: {
  searchParams: URLSearchParams;
  setSearchParams: SetURLSearchParams;
  data: TableFilterProps["data"];
}) {
  const handleCheckedChange = (
    key: string,
    val: string,
    isChecked: boolean,
  ) => {
    const params = new URLSearchParams(searchParams);

    if (isChecked) {
      params.set(key, val);
    } else {
      params.delete(key);
    }

    // عند تغيير أي فلتر ارجع لأول صفحة
    params.set("page", "1");

    setSearchParams(params);
  };

  return (
    <DropdownMenu dir="rtl">
      <DropdownMenuTrigger asChild>
        <Button variant="outline">فلاتر</Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-40" align="end">
        {data.map((g) => (
          <DropdownMenuGroup key={g.group}>
            <DropdownMenuLabel>{g.group}</DropdownMenuLabel>

            {g.option.map((o) => (
              <DropdownMenuItem
                key={`${o.key}-${o.val}`}
                onSelect={(e) => e.preventDefault()}
              >
                <label
                  htmlFor={`${o.key}-${o.val}`}
                  className="flex w-full cursor-pointer items-center gap-2"
                >
                  <Checkbox
                    id={`${o.key}-${o.val}`}
                    checked={searchParams.get(o.key) === o.val}
                    onCheckedChange={(checked) =>
                      handleCheckedChange(o.key, o.val, Boolean(checked))
                    }
                  />

                  <span>{o.label}</span>
                </label>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
