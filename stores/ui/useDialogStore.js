import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useDialogStore = defineStore('useDialog', () => {
    const showDialog = ref(false);
    const dialogType = ref('default');
    const dialogComponent = ref(null); // Holds the component to render
    const dialogProps = ref(null);

    function openDialog(component = null, type = 'default') {
        dialogComponent.value = component;
        dialogType.value = type;
        showDialog.value = true;
    }

    function closeDialog() {
        showDialog.value = false;
    }

    return {
        showDialog,
        dialogType,
        dialogComponent,
        dialogProps,
        openDialog,
        closeDialog
    };
});
