export default function FieldError({message}: { message?: string }) {
    return message ? <p className="text-xs text-destructive lg:text-sm">{message}</p> : null;
}
