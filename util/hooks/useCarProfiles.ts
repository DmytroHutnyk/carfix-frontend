import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {carProfileApi} from "@/util/api/carProfile/carProfileApi";
import {carProfileKeys} from "@/util/api/carProfile/keys";
import {CarProfile, CarProfileForm} from "@/util/types/carProfileTypes";
import {ApiError} from "@/util/types/apiTypes";

export function useCarProfiles(options?: { enabled?: boolean }) {
    const queryClient = useQueryClient();

    const listQuery = useQuery<CarProfile[], ApiError>({
        queryKey: carProfileKeys.list(),
        queryFn: carProfileApi.getMyCarProfiles,
        enabled: options?.enabled ?? true,
        staleTime: 5 * 60 * 1000,
    });

    const createMutation = useMutation({
        mutationFn: carProfileApi.createCarProfile,
        onSuccess: (created) => {
            queryClient.setQueryData<CarProfile[]>(carProfileKeys.list(), (list) =>
                list ? [...list, created] : [created]
            );
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({id, form}: { id: string; form: CarProfileForm }) =>
            carProfileApi.updateCarProfile(id, form),
        onSuccess: (updated) => {
            queryClient.setQueryData<CarProfile[]>(carProfileKeys.list(), (list) =>
                list?.map((c) => (c.id === updated.id ? updated : c))
            );
        },
    });

    const deleteMutation = useMutation({
        mutationFn: carProfileApi.deleteCarProfile,
        onSuccess: (_data, id) => {
            queryClient.setQueryData<CarProfile[]>(carProfileKeys.list(), (list) =>
                list?.filter((c) => c.id !== id)
            );
        },
    });

    return {
        carProfiles: listQuery.data ?? [],
        isLoading: listQuery.isLoading,
        isError: listQuery.isError,
        error: listQuery.error,

        createCarProfile: (form: CarProfileForm) => createMutation.mutateAsync(form),
        updateCarProfile: (id: string, form: CarProfileForm) => updateMutation.mutateAsync({id, form}),
        deleteCarProfile: (id: string) => deleteMutation.mutateAsync(id),
    }
}
