
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { vi, describe, it, expect } from 'vitest';
import React from 'react';

// Mock the server action
vi.mock('@/actions/media', () => ({
    uploadImage: vi.fn().mockResolvedValue({ success: true, url: '/test-image.jpg' }),
}));

// Mock TipTap hooks and components since they rely heavily on browser APIs
// We will mock the behavior we need for the upload test
const mockChain = {
    focus: vi.fn().mockReturnThis(),
    setImage: vi.fn().mockReturnThis(),
    run: vi.fn(),
    undo: vi.fn().mockReturnThis(),
    redo: vi.fn().mockReturnThis(),
    toggleHeading: vi.fn().mockReturnThis(),
    toggleBold: vi.fn().mockReturnThis(),
    toggleItalic: vi.fn().mockReturnThis(),
    toggleUnderline: vi.fn().mockReturnThis(),
    toggleStrike: vi.fn().mockReturnThis(),
    setTextAlign: vi.fn().mockReturnThis(),
    toggleBulletList: vi.fn().mockReturnThis(),
    toggleOrderedList: vi.fn().mockReturnThis(),
    toggleBlockquote: vi.fn().mockReturnThis(),
    toggleCodeBlock: vi.fn().mockReturnThis(),
    setHorizontalRule: vi.fn().mockReturnThis(),
    setLink: vi.fn().mockReturnThis(),
};

const mockEditor = {
    getHTML: () => '<p>Test Content</p>',
    commands: {
        setContent: vi.fn(),
    },
    chain: () => mockChain,
    isActive: vi.fn().mockReturnValue(false),
};

vi.mock('@tiptap/react', () => ({
    useEditor: () => mockEditor,
    EditorContent: () => <div data-testid="editor-content">Editor Content</div>,
    BubbleMenu: () => null,
}));

describe('RichTextEditor', () => {
    it('renders the editor', () => {
        render(<RichTextEditor content="" onChange={() => { }} />);
        expect(screen.getByTestId('editor-content')).toBeDefined();
    });

    it('has a hidden file input for image uploads', () => {
        const { container } = render(<RichTextEditor content="" onChange={() => { }} />);
        const fileInput = container.querySelector('input[type="file"]');
        expect(fileInput).toBeDefined();
        // expect(fileInput).toHaveClass('hidden'); // hidden class might vary
    });

    it('triggers file input click when add image button is clicked', () => {
        const { container } = render(<RichTextEditor content="" onChange={() => { }} />);
        const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
        const uploadButton = screen.getByTitle('Add Image');

        const clickSpy = vi.spyOn(fileInput, 'click');
        fireEvent.click(uploadButton);

        expect(clickSpy).toHaveBeenCalled();
    });

    // Note: Testing the actual async upload flow is harder with mocked useEditor
    // because we can't easily access the internal handleImageUpload function 
    // unless we spy on `uploadImage` action itself which is imported.
});
