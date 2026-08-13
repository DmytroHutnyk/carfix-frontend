import {useCarProfiles} from "@/features/carProfile/useCarProfiles";
import {CarProfile} from "@/features/carProfile/carProfileTypes";
import {useSelectedCarProfileId} from "@/lib/store";

export function useSelectedCarProfile(options?: { enabled?: boolean }) {
    const {carProfiles, isLoading} = useCarProfiles(options);
    const selectedCarProfileId = useSelectedCarProfileId((s) => s.selectedCarProfileId);
    const setSelectedCarProfileId = useSelectedCarProfileId((s) => s.setSelectedCarProfileId);

    const sorted = [...carProfiles].sort((a, b) => a.name.localeCompare(b.name));
    const selectedCarProfile: CarProfile | null =
        sorted.find((c) => c.id === selectedCarProfileId) ?? sorted[0] ?? null;

    return {
        carProfiles: sorted,
        selectedCarProfile,
        selectCarProfile: setSelectedCarProfileId,
        isLoading,
    };
}
