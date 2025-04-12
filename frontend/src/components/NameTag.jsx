function NameTag({ name }) {
    return (
      <div className="px-2 py-1 bg-[var(--secondary)] text-white text-xs rounded-full font-mono shadow-sm">
        {name}
      </div>
    );
  }
  
  export default NameTag;  