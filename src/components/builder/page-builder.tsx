'use client'

import { useState, useEffect } from 'react'
import { updatePageContent } from '@/app/(main)/builder/[projectId]/actions'

interface Element {
  id: string
  type: 'text' | 'button' | 'image' | 'container'
  content?: string
  props?: any
  children?: Element[]
}

interface PageBuilderProps {
  page: any
  projectId: string
}

export function PageBuilder({ page, projectId }: PageBuilderProps) {
  const [elements, setElements] = useState<Element[]>(
    page.content?.elements || []
  )
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Auto-save
  useEffect(() => {
    const timer = setTimeout(() => {
      if (elements.length > 0 || page.content?.elements?.length > 0) {
        handleSave()
      }
    }, 2000)
    return () => clearTimeout(timer)
  }, [elements])

  const handleSave = async () => {
    setIsSaving(true)
    await updatePageContent(page.id, { elements })
    setIsSaving(false)
  }

  const handleDrop = (e: React.DragEvent, targetIndex?: number) => {
    e.preventDefault()
    const type = e.dataTransfer.getData('elementType')
    
    const newElement: Element = {
      id: Date.now().toString(),
      type: type as Element['type'],
      content: type === 'text' ? 'Edit this text' : undefined,
      props: {}
    }

    if (targetIndex !== undefined) {
      const newElements = [...elements]
      newElements.splice(targetIndex, 0, newElement)
      setElements(newElements)
    } else {
      setElements([...elements, newElement])
    }
  }

  const handleDragStart = (e: React.DragEvent, type: string) => {
    e.dataTransfer.setData('elementType', type)
  }

  const deleteElement = (id: string) => {
    setElements(elements.filter(el => el.id !== id))
    setSelectedElement(null)
  }

  const updateElement = (id: string, updates: Partial<Element>) => {
    setElements(elements.map(el => 
      el.id === id ? { ...el, ...updates } : el
    ))
  }

  return (
    <div className="flex-1 flex">
      {/* Left Sidebar - Components */}
      <div className="w-64 border-r bg-gray-50 p-4">
        <h3 className="font-semibold mb-4">Components</h3>
        <div className="space-y-2">
          <div 
            draggable
            onDragStart={(e) => handleDragStart(e, 'text')}
            className="p-3 bg-white border rounded cursor-move hover:shadow"
          >
            Text
          </div>
          <div 
            draggable
            onDragStart={(e) => handleDragStart(e, 'button')}
            className="p-3 bg-white border rounded cursor-move hover:shadow"
          >
            Button
          </div>
          <div 
            draggable
            onDragStart={(e) => handleDragStart(e, 'image')}
            className="p-3 bg-white border rounded cursor-move hover:shadow"
          >
            Image
          </div>
          <div 
            draggable
            onDragStart={(e) => handleDragStart(e, 'container')}
            className="p-3 bg-white border rounded cursor-move hover:shadow"
          >
            Container
          </div>
        </div>
        {isSaving && (
          <p className="text-sm text-gray-500 mt-4">Saving...</p>
        )}
      </div>

      {/* Canvas */}
      <div className="flex-1 bg-gray-100 p-8 overflow-auto">
        <div 
          className="max-w-6xl mx-auto bg-white min-h-[600px] shadow-lg p-8"
          onDrop={(e) => handleDrop(e)}
          onDragOver={(e) => e.preventDefault()}
        >
          {elements.length === 0 ? (
            <div className="text-center text-gray-400 py-20">
              Drag components here to start building
            </div>
          ) : (
            <div className="space-y-4">
              {elements.map((element, index) => (
                <div
                  key={element.id}
                  className={`relative group ${
                    selectedElement === element.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedElement(element.id)}
                >
                  {/* Render different elements */}
                  {element.type === 'text' && (
                    <p 
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => updateElement(element.id, { 
                        content: e.currentTarget.textContent || '' 
                      })}
                      className="p-2 hover:bg-gray-50"
                    >
                      {element.content}
                    </p>
                  )}
                  {element.type === 'button' && (
                    <button className="px-4 py-2 bg-blue-600 text-white rounded">
                      {element.content || 'Button'}
                    </button>
                  )}
                  {element.type === 'image' && (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                      Image Placeholder
                    </div>
                  )}
                  {element.type === 'container' && (
                    <div className="border-2 border-dashed border-gray-300 p-8 min-h-[100px]">
                      Container
                    </div>
                  )}
                  
                  {/* Delete button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteElement(element.id)
                    }}
                    className="absolute top-0 right-0 bg-red-500 text-white p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar - Properties */}
      <div className="w-64 border-l bg-gray-50 p-4">
        <h3 className="font-semibold mb-4">Properties</h3>
        {selectedElement ? (
          <div className="space-y-4">
            <p className="text-sm">Element ID: {selectedElement}</p>
            <button 
              onClick={() => deleteElement(selectedElement)}
              className="w-full p-2 bg-red-500 text-white rounded text-sm"
            >
              Delete Element
            </button>
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            Select an element to edit its properties
          </p>
        )}
      </div>
    </div>
  )
}