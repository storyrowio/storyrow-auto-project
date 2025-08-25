import {useState} from "react";
import {Input} from "@/components/ui/input";
import InputAdornments from "@/components/ui/input-adornments";

interface MoneyInputProps {
    value: number
    onChange: (value: number) => void
}

export default function MoneyInput(props: MoneyInputProps) {
    const { value, onChange }: MoneyInputProps = props;
    const [displayValue, setDisplayValue] = useState(value && formatNumber(value?.toString()))

    function formatNumber(val: string) {
        return val.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    }

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const raw = e.target.value.replace(/\D/g, '') // Remove all non-digits
        const formatted = formatNumber(raw)

        setDisplayValue(formatted)
        onChange(Number(raw))
    }

    return (
        <InputAdornments
            type="text"
            value={displayValue}
            onChange={handleInputChange}
            placeholder="0"
            className="w-full"
            prefix={<span className="font-semibold text-xs text-gray-500">Rp</span>}
        />
    )
}
