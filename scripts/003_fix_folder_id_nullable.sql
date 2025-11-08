-- Make folder_id nullable to allow documents at course level
ALTER TABLE public.documents
ALTER COLUMN folder_id DROP NOT NULL;

-- Update the foreign key constraint to allow NULL values
ALTER TABLE public.documents
DROP CONSTRAINT documents_folder_id_fkey;

ALTER TABLE public.documents
ADD CONSTRAINT documents_folder_id_fkey 
FOREIGN KEY (folder_id) REFERENCES public.folders(id) ON DELETE CASCADE;
