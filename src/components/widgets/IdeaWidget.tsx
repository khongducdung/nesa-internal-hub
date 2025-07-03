import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { 
  Lightbulb, 
  Plus, 
  Share2, 
  Edit3, 
  Trash2, 
  Tag, 
  Clock,
  Users,
  Search,
  Filter,
  Eye
} from 'lucide-react';
import { useMyIdeas, useSharedIdeas, useCreateIdea, useUpdateIdea, useDeleteIdea, type Idea, type CreateIdeaData } from '@/hooks/useIdeas';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogOverlay } from '@/components/ui/dialog';

interface IdeaFormData {
  title: string;
  content: string;
  tags: string;
  is_shared: boolean;
  priority: 'low' | 'medium' | 'high';
}

const priorityColors = {
  low: 'bg-slate-100 text-slate-700',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-red-100 text-red-700'
};

const priorityLabels = {
  low: 'Thấp',
  medium: 'Trung bình',
  high: 'Cao'
};

export function IdeaWidget() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingIdea, setEditingIdea] = useState<Idea | null>(null);
  const [viewingIdea, setViewingIdea] = useState<Idea | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  
  const [formData, setFormData] = useState<IdeaFormData>({
    title: '',
    content: '',
    tags: '',
    is_shared: false,
    priority: 'medium'
  });

  const { data: myIdeas = [] } = useMyIdeas();
  const { data: sharedIdeas = [] } = useSharedIdeas();
  const createIdea = useCreateIdea();
  const updateIdea = useUpdateIdea();
  const deleteIdea = useDeleteIdea();

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      tags: '',
      is_shared: false,
      priority: 'medium'
    });
    setEditingIdea(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const ideaData: CreateIdeaData = {
      title: formData.title,
      content: formData.content,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      is_shared: formData.is_shared,
      priority: formData.priority
    };

    if (editingIdea) {
      await updateIdea.mutateAsync({ id: editingIdea.id, data: ideaData });
    } else {
      await createIdea.mutateAsync(ideaData);
    }

    resetForm();
    setIsCreateOpen(false);
  };

  const handleEdit = (idea: Idea) => {
    setEditingIdea(idea);
    setFormData({
      title: idea.title,
      content: idea.content,
      tags: idea.tags.join(', '),
      is_shared: idea.is_shared,
      priority: idea.priority
    });
    setIsCreateOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bạn có chắc muốn xóa ý tưởng này?')) {
      await deleteIdea.mutateAsync(id);
    }
  };

  const filterIdeas = (ideas: Idea[]) => {
    return ideas.filter(idea => {
      const matchesSearch = idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           idea.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           idea.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesPriority = filterPriority === 'all' || idea.priority === filterPriority;
      
      return matchesSearch && matchesPriority;
    });
  };

  const IdeaList = ({ ideas, title }: { ideas: Idea[]; title: string }) => {
    const filteredIdeas = filterIdeas(ideas);
    
    return (
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-foreground/70 mb-3">{title}</h3>
        {filteredIdeas.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground text-sm">
            {searchTerm || filterPriority !== 'all' ? 'Không tìm thấy ý tưởng phù hợp' : 'Chưa có ý tưởng nào'}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredIdeas.map((idea) => (
              <div
                key={idea.id}
                className="group p-3 bg-background border border-border/50 rounded-lg hover:border-border transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm line-clamp-1 text-foreground">{idea.title}</h4>
                   <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                     <Button
                       variant="ghost"
                       size="sm"
                       className="h-6 w-6 p-0"
                       onClick={() => setViewingIdea(idea)}
                       title="Xem chi tiết"
                     >
                       <Eye className="h-3 w-3" />
                     </Button>
                     {ideas === myIdeas && (
                       <>
                         <Button
                           variant="ghost"
                           size="sm"
                           className="h-6 w-6 p-0"
                           onClick={() => handleEdit(idea)}
                           title="Chỉnh sửa"
                         >
                           <Edit3 className="h-3 w-3" />
                         </Button>
                         <Button
                           variant="ghost"
                           size="sm"
                           className="h-6 w-6 p-0 text-red-500 hover:text-red-600"
                           onClick={() => handleDelete(idea.id)}
                           title="Xóa"
                         >
                           <Trash2 className="h-3 w-3" />
                         </Button>
                       </>
                     )}
                   </div>
                </div>
                
                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                  {idea.content}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={`text-xs px-1.5 py-0.5 ${priorityColors[idea.priority]}`}>
                      {priorityLabels[idea.priority]}
                    </Badge>
                    {idea.is_shared && (
                      <Badge variant="outline" className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700">
                        <Share2 className="h-2.5 w-2.5 mr-1" />
                        Chia sẻ
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {new Date(idea.created_at).toLocaleDateString('vi-VN')}
                  </div>
                </div>
                
                {idea.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {idea.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center text-xs bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded"
                      >
                        <Tag className="h-2.5 w-2.5 mr-1" />
                        {tag}
                      </span>
                    ))}
                    {idea.tags.length > 3 && (
                      <span className="text-xs text-muted-foreground">+{idea.tags.length - 3}</span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-80 h-[600px] bg-background border border-border/50 rounded-2xl shadow-xl backdrop-blur-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border/50 bg-gradient-to-r from-primary/5 to-purple-500/5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500">
              <Lightbulb className="h-4 w-4 text-white" />
            </div>
            <h2 className="font-semibold text-foreground">iDea</h2>
          </div>
          
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-8 w-8 p-0" onClick={resetForm}>
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto"
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '90vw',
                maxWidth: '900px'
              }}
            >
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  {editingIdea ? 'Chỉnh sửa ý tưởng' : 'Ý tưởng mới'}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Tiêu đề *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Nhập tiêu đề ý tưởng..."
                    required
                  />
                </div>
                
                 <div>
                   <Label htmlFor="content">Nội dung *</Label>
                   <RichTextEditor
                     value={formData.content}
                     onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
                     placeholder="Mô tả chi tiết ý tưởng của bạn..."
                     minHeight="120px"
                   />
                 </div>
                
                <div>
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="Tag1, Tag2, Tag3..."
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="priority">Mức độ ưu tiên</Label>
                    <Select value={formData.priority} onValueChange={(value: 'low' | 'medium' | 'high') => 
                      setFormData(prev => ({ ...prev, priority: value }))
                    }>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Thấp</SelectItem>
                        <SelectItem value="medium">Trung bình</SelectItem>
                        <SelectItem value="high">Cao</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Switch
                      id="share"
                      checked={formData.is_shared}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_shared: checked }))}
                    />
                    <Label htmlFor="share" className="text-sm">Chia sẻ</Label>
                  </div>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button type="submit" disabled={createIdea.isPending || updateIdea.isPending} className="flex-1">
                    {editingIdea ? 'Cập nhật' : 'Lưu ý tưởng'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                    Hủy
                  </Button>
                </div>
              </form>
            </DialogContent>
           </Dialog>

           {/* View Idea Dialog */}
           <Dialog open={!!viewingIdea} onOpenChange={() => setViewingIdea(null)}>
             <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto"
               style={{
                 position: 'fixed',
                 top: '50%',
                 left: '50%',
                 transform: 'translate(-50%, -50%)',
                 width: '90vw',
                 maxWidth: '900px'
               }}
             >
               <DialogHeader>
                 <DialogTitle className="flex items-center gap-2">
                   <Lightbulb className="h-5 w-5 text-yellow-500" />
                   {viewingIdea?.title}
                 </DialogTitle>
               </DialogHeader>
               
               {viewingIdea && (
                 <div className="space-y-6">
                   <div className="flex items-center gap-4">
                     <Badge variant="outline" className={`${priorityColors[viewingIdea.priority]}`}>
                       Mức độ: {priorityLabels[viewingIdea.priority]}
                     </Badge>
                     {viewingIdea.is_shared && (
                       <Badge variant="outline" className="bg-blue-100 text-blue-700">
                         <Share2 className="h-3 w-3 mr-1" />
                         Đã chia sẻ
                       </Badge>
                     )}
                     <div className="flex items-center gap-1 text-sm text-muted-foreground">
                       <Clock className="h-3 w-3" />
                       {new Date(viewingIdea.created_at).toLocaleDateString('vi-VN')}
                     </div>
                   </div>

                   <div>
                     <Label className="text-base font-medium">Nội dung:</Label>
                     <div 
                       className="mt-2 p-4 border rounded-lg bg-gray-50 prose prose-sm max-w-none"
                       dangerouslySetInnerHTML={{ __html: viewingIdea.content }}
                     />
                   </div>

                   {viewingIdea.tags.length > 0 && (
                     <div>
                       <Label className="text-base font-medium">Tags:</Label>
                       <div className="flex flex-wrap gap-2 mt-2">
                         {viewingIdea.tags.map((tag, index) => (
                           <span
                             key={index}
                             className="inline-flex items-center text-sm bg-secondary text-secondary-foreground px-2 py-1 rounded"
                           >
                             <Tag className="h-3 w-3 mr-1" />
                             {tag}
                           </span>
                         ))}
                       </div>
                     </div>
                   )}

                   <div className="flex justify-end gap-2 pt-4 border-t">
                     <Button variant="outline" onClick={() => setViewingIdea(null)}>
                       Đóng
                     </Button>
                     {viewingIdea.created_by === myIdeas.find(idea => idea.id === viewingIdea.id)?.created_by && (
                       <Button onClick={() => {
                         handleEdit(viewingIdea);
                         setViewingIdea(null);
                       }}>
                         Chỉnh sửa
                       </Button>
                     )}
                   </div>
                 </div>
               )}
             </DialogContent>
           </Dialog>
         </div>
        
        {/* Search and Filter */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm ý tưởng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 h-8 text-sm"
            />
          </div>
          
          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="h-8 text-sm">
              <div className="flex items-center gap-1">
                <Filter className="h-3 w-3" />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả mức độ</SelectItem>
              <SelectItem value="high">Cao</SelectItem>
              <SelectItem value="medium">Trung bình</SelectItem>
              <SelectItem value="low">Thấp</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="my-ideas" className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-2 mx-4 mt-4">
            <TabsTrigger value="my-ideas" className="text-xs">
              <Edit3 className="h-3 w-3 mr-1" />
              Của tôi ({myIdeas.length})
            </TabsTrigger>
            <TabsTrigger value="shared" className="text-xs">
              <Users className="h-3 w-3 mr-1" />
              Chia sẻ ({sharedIdeas.length})
            </TabsTrigger>
          </TabsList>
          
          <div className="flex-1 overflow-y-auto">
            <TabsContent value="my-ideas" className="p-4 pt-2 h-full">
              <IdeaList ideas={myIdeas} title="" />
            </TabsContent>
            
            <TabsContent value="shared" className="p-4 pt-2 h-full">
              <IdeaList ideas={sharedIdeas} title="" />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}