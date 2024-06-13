export const useGloabalState = defineStore('useGlobalState', () => {
    const isMobileNavOpen = ref(false);
    const loading = ref(false);

    return {
        loading,
        isMobileNavOpen
    };
});

