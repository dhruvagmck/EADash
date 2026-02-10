import { useState } from "react"
import type { VIPContact } from "@/data/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Plus, User, X } from "lucide-react"

interface VIPContactListProps {
  contacts: VIPContact[]
  onAdd: (contact: VIPContact) => void
  onRemove: (contactName: string) => void
}

export default function VIPContactList({
  contacts,
  onAdd,
  onRemove,
}: VIPContactListProps) {
  const [adding, setAdding] = useState(false)
  const [name, setName] = useState("")
  const [relationship, setRelationship] = useState("")
  const [notes, setNotes] = useState("")

  const handleAdd = () => {
    if (!name.trim() || !relationship.trim()) return
    onAdd({ name: name.trim(), relationship: relationship.trim(), notes: notes.trim() })
    setName("")
    setRelationship("")
    setNotes("")
    setAdding(false)
  }

  return (
    <div className="space-y-3">
      {contacts.map((contact) => (
        <Card key={contact.name} className="gap-0 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted">
              <User className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{contact.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {contact.relationship}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 opacity-0 transition-opacity group-hover:opacity-100 hover:opacity-100"
                  onClick={() => onRemove(contact.name)}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
              {contact.notes && (
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                  {contact.notes}
                </p>
              )}
            </div>
          </div>
        </Card>
      ))}

      {adding ? (
        <div className="space-y-2 rounded-lg border border-dashed p-3">
          <div className="flex gap-2">
            <Input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-8 text-xs"
              autoFocus
            />
            <Input
              placeholder="Relationship"
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              className="h-8 text-xs"
            />
          </div>
          <Input
            placeholder="Notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            className="h-8 text-xs"
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleAdd} className="h-7 text-xs">
              Add Contact
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setAdding(false)
                setName("")
                setRelationship("")
                setNotes("")
              }}
              className="h-7 text-xs"
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button
          variant="outline"
          className="w-full gap-2 border-dashed text-muted-foreground hover:text-foreground"
          onClick={() => setAdding(true)}
        >
          <Plus className="h-4 w-4" />
          Add Contact
        </Button>
      )}
    </div>
  )
}
