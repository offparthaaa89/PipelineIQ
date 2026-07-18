type SearchInputProps = {
    label: string;
    value: string;
    placeholder: string;
    onChange: (value: string) => void;
  };
  
  export default function SearchInput({
    label,
    value,
    placeholder,
    onChange,
  }: SearchInputProps) {
    return (
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">
          {label}
        </label>
  
        <input
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10"
        />
      </div>
    );
  }