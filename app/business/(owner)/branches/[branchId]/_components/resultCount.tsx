export default function ResultCount({count}: {count: number}) {
    return (
        <span className="text-xs text-muted-foreground">
            Result: {count} {count === 1 ? "entry" : "entries"}
        </span>
    );
}
