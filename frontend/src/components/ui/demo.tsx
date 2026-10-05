import { CartoonButton } from "@/components/ui/cartoon-button"

export function Demo(){
    return(
        <div className="flex flex-row gap-4">
            <CartoonButton label="Click me!" onClick={() => alert('Button clicked!')}/>
            <CartoonButton label="Click me!" color="bg-purple-400" hasHighlight={false} disabled onClick={() => alert('Button clicked!')}/>
        </div>
    )
}
