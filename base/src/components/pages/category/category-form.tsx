import { Input } from "@/components/ui/input";
import {useFormik} from "formik";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";
import axios from "axios";
import {SidebarContent, SidebarFooter} from "@/components/ui/sidebar";
import {Label} from "@/components/ui/label";

export default function CategoryForm(props: any) {
    const { data, onRefresh, onClose } = props;

    const formik = useFormik({
        initialValues: {
            categories: [
                {name: data?.name ?? '', type: data?.type ?? ''}
            ]
        },
        onSubmit: (values) => handleSubmit(values)
    });

    const addRow = () => {
        formik.setFieldValue('categories', [...formik.values.categories, {name: '', type: ''}]);
    };

    const handleKeyDown = (e: any) => {
        if (e.key === "Enter") {
            e.preventDefault()
            addRow()
        }
    }

    const submit = (params: any) => {
        if (data?.id) {
            return axios.patch(`/api/categories/${data?.id}`, params);
        }

        return axios.post('/api/categories', params);
    };

    const handleSubmit = (values: any) => {
        return submit(values).then(() => {
            onRefresh();
            onClose();
        });
    };

    return (
        <>
            <SidebarContent>
                <form className="py-4 px-2 lg:px-6 space-y-4">
                    {formik.values.categories.map((e, i) => (
                        <div className="flex flex-row gap-2" key={i}>
                            <Select
                                value={e.type}
                                onValueChange={(val) => formik.setFieldValue(`categories[${i}].type`, val)}>
                                <SelectTrigger
                                    aria-label="Select type">
                                    <SelectValue placeholder="Select type"/>
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem value="income" className="rounded-lg">Income</SelectItem>
                                    <SelectItem value="expense" className="rounded-lg">Expense</SelectItem>
                                    <SelectItem value="general" className="rounded-lg">General</SelectItem>
                                </SelectContent>
                            </Select>
                            <Input
                                placeholder="Enter category name"
                                name={`categories[${i}].name`}
                                onChange={formik.handleChange}
                                onKeyDown={handleKeyDown}
                                value={formik.values.categories[i].name}
                            />
                            {!data && (
                                <Button
                                    type="button"
                                    className="flex-1"
                                    variant="ghost"
                                    size="icon" onClick={addRow}>
                                    <Plus/>
                                </Button>
                            )}
                        </div>
                    ))}
                </form>
            </SidebarContent>
            <SidebarFooter className="flex-row gap-4">
                <Button
                    className="flex-1"
                    variant="tonal"
                    onClick={onClose}>
                    Cancel
                </Button>
                <Button
                    disabled={formik.isSubmitting}
                    className="flex-1"
                    onClick={formik.submitForm}>
                    Save
                </Button>
            </SidebarFooter>

        </>
    )
}
