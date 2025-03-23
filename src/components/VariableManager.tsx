import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Trash, Edit, Save, Variable as VariableIcon } from 'lucide-react';

type Variable = {
  id: string;
  name: string;
  type: 'number' | 'string' | 'boolean' | 'array';
  value: any;
  scope: 'global' | 'object';
  objectId?: string;
};

interface VariableManagerProps {
  variables: Variable[];
  objects: { id: string; type: string }[];
  onSaveVariables: (variables: Variable[]) => void;
  selectedObjectId?: string | null;
}

const VariableManager: React.FC<VariableManagerProps> = ({
  variables,
  objects,
  onSaveVariables,
  selectedObjectId
}) => {
  const { toast } = useToast();
  const [gameVariables, setGameVariables] = useState<Variable[]>(variables);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVariable, setEditingVariable] = useState<Variable | null>(null);
  const [activeScope, setActiveScope] = useState<'global' | 'object'>(selectedObjectId ? 'object' : 'global');
  
  const filteredVariables = gameVariables.filter(v => {
    if (activeScope === 'global') return v.scope === 'global';
    return v.scope === 'object' && v.objectId === selectedObjectId;
  });

  const handleSaveVariables = () => {
    onSaveVariables(gameVariables);
    toast({
      title: 'Variables Saved',
      description: 'Game variables have been updated.',
    });
  };

  const handleAddVariable = (newVariable: Omit<Variable, 'id'>) => {
    const variable: Variable = {
      ...newVariable,
      id: `var-${Date.now()}`
    };
    
    setGameVariables([...gameVariables, variable]);
    setDialogOpen(false);
    setEditingVariable(null);
    
    toast({
      title: 'Variable Added',
      description: `Added ${variable.name} variable.`,
    });
  };

  const handleUpdateVariable = (variable: Variable) => {
    setGameVariables(gameVariables.map(v => v.id === variable.id ? variable : v));
    setDialogOpen(false);
    setEditingVariable(null);
    
    toast({
      title: 'Variable Updated',
      description: `Updated ${variable.name} variable.`,
    });
  };

  const handleDeleteVariable = (id: string) => {
    setGameVariables(gameVariables.filter(v => v.id !== id));
    
    toast({
      title: 'Variable Deleted',
      description: 'Variable has been removed.',
    });
  };

  const openEditDialog = (variable: Variable) => {
    setEditingVariable(variable);
    setDialogOpen(true);
  };

  const getDefaultValueForType = (type: 'number' | 'string' | 'boolean' | 'array') => {
    switch (type) {
      case 'number': return 0;
      case 'string': return '';
      case 'boolean': return false;
      case 'array': return [];
      default: return null;
    }
  };

  const formatValue = (value: any, type: 'number' | 'string' | 'boolean' | 'array') => {
    if (type === 'array') {
      return Array.isArray(value) ? `[${value.join(', ')}]` : '[]';
    } else if (type === 'boolean') {
      return value ? 'true' : 'false';
    }
    return String(value);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-3 border-b">
        <h2 className="text-sm font-medium">Game Variables</h2>
        <div className="flex space-x-2">
          <Tabs 
            value={activeScope} 
            onValueChange={(v) => setActiveScope(v as 'global' | 'object')}
            className="mr-auto"
          >
            <TabsList>
              <TabsTrigger value="global" className="text-xs">Global</TabsTrigger>
              <TabsTrigger 
                value="object" 
                className="text-xs"
                disabled={!selectedObjectId}
              >
                Object
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Variable
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingVariable ? 'Edit Variable' : 'Add Variable'}</DialogTitle>
              </DialogHeader>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const name = formData.get('name') as string;
                const type = formData.get('type') as 'number' | 'string' | 'boolean' | 'array';
                const scope = formData.get('scope') as 'global' | 'object';
                const objectId = formData.get('objectId') as string;
                
                let value: any = formData.get('value');
                
                if (type === 'number') {
                  value = Number(value);
                } else if (type === 'boolean') {
                  value = value === 'true';
                } else if (type === 'array') {
                  try {
                    value = JSON.parse(value);
                    if (!Array.isArray(value)) value = [];
                  } catch (e) {
                    value = [];
                  }
                }
                
                if (editingVariable) {
                  handleUpdateVariable({
                    ...editingVariable,
                    name,
                    type,
                    value,
                    scope,
                    objectId: scope === 'object' ? objectId : undefined
                  });
                } else {
                  handleAddVariable({
                    name,
                    type,
                    value,
                    scope,
                    objectId: scope === 'object' ? objectId : undefined
                  });
                }
              }}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">Name</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      defaultValue={editingVariable?.name || ''}
                      className="col-span-3" 
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="type" className="text-right">Type</Label>
                    <Select 
                      name="type" 
                      defaultValue={editingVariable?.type || 'number'}
                      onValueChange={(value) => {
                        const typeInput = document.getElementById('type') as HTMLInputElement;
                        if (typeInput) typeInput.value = value;
                        
                        const valueInput = document.getElementById('value') as HTMLInputElement;
                        if (valueInput) {
                          valueInput.value = String(getDefaultValueForType(value as any));
                        }
                      }}
                    >
                      <input type="hidden" id="type" name="type" value={editingVariable?.type || 'number'} />
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="number">Number</SelectItem>
                        <SelectItem value="string">String</SelectItem>
                        <SelectItem value="boolean">Boolean</SelectItem>
                        <SelectItem value="array">Array</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="value" className="text-right">Value</Label>
                    <Input 
                      id="value" 
                      name="value" 
                      defaultValue={editingVariable ? formatValue(editingVariable.value, editingVariable.type) : '0'}
                      className="col-span-3" 
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Scope</Label>
                    <RadioGroup 
                      defaultValue={editingVariable?.scope || activeScope}
                      className="col-span-3 flex flex-col space-y-1"
                      name="scope"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="global" id="scope-global" />
                        <Label htmlFor="scope-global">Global</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem 
                          value="object" 
                          id="scope-object" 
                          disabled={!selectedObjectId}
                        />
                        <Label htmlFor="scope-object">Object-specific</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  {selectedObjectId && (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="objectId" className="text-right">Object</Label>
                      <Select 
                        name="objectId" 
                        defaultValue={editingVariable?.objectId || selectedObjectId}
                        disabled={!selectedObjectId}
                      >
                        <input 
                          type="hidden" 
                          id="objectId" 
                          name="objectId" 
                          value={editingVariable?.objectId || selectedObjectId}
                        />
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select object" />
                        </SelectTrigger>
                        <SelectContent>
                          {objects.map(obj => (
                            <SelectItem key={obj.id} value={obj.id}>
                              {obj.type} (ID: {obj.id.slice(0, 4)}...)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
                
                <DialogFooter>
                  <Button type="submit">
                    {editingVariable ? 'Update Variable' : 'Add Variable'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          
          <Button variant="default" size="sm" onClick={handleSaveVariables}>
            <Save className="h-4 w-4 mr-1" />
            Save All
          </Button>
        </div>
      </div>
      
      <div className="flex-1 p-4">
        {filteredVariables.length === 0 ? (
          <div className="text-center text-muted-foreground p-8">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <VariableIcon className="h-6 w-6 opacity-50" />
            </div>
            <p>No {activeScope} variables yet</p>
            <p className="text-sm mt-2">
              Click "Add Variable" to create a new {activeScope} variable
              {activeScope === 'object' && selectedObjectId ? ' for this object' : ''}.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Value</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVariables.map((variable) => (
                <TableRow key={variable.id}>
                  <TableCell className="font-medium">{variable.name}</TableCell>
                  <TableCell className="capitalize">{variable.type}</TableCell>
                  <TableCell className="font-mono text-xs">
                    {formatValue(variable.value, variable.type)}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => openEditDialog(variable)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-destructive"
                        onClick={() => handleDeleteVariable(variable.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default VariableManager;
