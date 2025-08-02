import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Category from '@/models/Category';
import { requireAuth } from '@/lib/auth';

// Get all categories
export async function GET(request: NextRequest) {
  await dbConnect();
  
  try {
    let categories = await Category.find({ isActive: true }).sort({ name: 1 });
    
    // If no categories exist, create default ones
    if (categories.length === 0) {
      const defaultCategories = [
        { name: 'Technical Support', description: 'Technical issues and troubleshooting', color: '#3B82F6', isActive: true },
        { name: 'Billing', description: 'Billing and payment related queries', color: '#10B981', isActive: true },
        { name: 'General Inquiry', description: 'General questions and information requests', color: '#8B5CF6', isActive: true },
        { name: 'Bug Report', description: 'Report bugs and software issues', color: '#F59E0B', isActive: true },
        { name: 'Feature Request', description: 'Request new features or enhancements', color: '#EF4444', isActive: true }
      ];
      
      categories = await Category.insertMany(defaultCategories);
    }
    
    return NextResponse.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Categories fetch error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch categories'
    }, { status: 500 });
  }
}

// Create new category (Admin only)
export async function POST(request: NextRequest) {
  const authResult = await requireAuth(request, ['admin']);
  
  if (!authResult) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  const { name, description, color } = await request.json();

  try {
    const category = new Category({
      name,
      description,
      color: color || '#3B82F6'
    });

    await category.save();

    return NextResponse.json({
      success: true,
      data: category,
      message: 'Category created successfully'
    }, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({
        success: false,
        error: 'Category with this name already exists'
      }, { status: 409 });
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to create category'
    }, { status: 500 });
  }
}

// Update category (Admin only)
export async function PUT(request: NextRequest) {
  const authResult = await requireAuth(request, ['admin']);
  
  if (!authResult) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  const { id, name, description, color, isActive } = await request.json();

  try {
    const category = await Category.findByIdAndUpdate(
      id,
      { name, description, color, isActive },
      { new: true, runValidators: true }
    );

    if (!category) {
      return NextResponse.json({
        success: false,
        error: 'Category not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: category,
      message: 'Category updated successfully'
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: 'Failed to update category'
    }, { status: 500 });
  }
}

// Delete category (Admin only)
export async function DELETE(request: NextRequest) {
  const authResult = await requireAuth(request, ['admin']);
  
  if (!authResult) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({
      success: false,
      error: 'Category ID is required'
    }, { status: 400 });
  }

  try {
    const category = await Category.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!category) {
      return NextResponse.json({
        success: false,
        error: 'Category not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Category deactivated successfully'
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: 'Failed to delete category'
    }, { status: 500 });
  }
}
