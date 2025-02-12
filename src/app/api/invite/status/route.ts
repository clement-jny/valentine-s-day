import { NextRequest, NextResponse } from 'next/server';
import { updateInvitationStatus } from '@/actions/invite';
import { EStatus } from '@/types/invite';

export const PATCH = async (request: NextRequest) => {
  const { ref, status } = (await request.json()) as {
    ref: string;
    status: keyof typeof EStatus;
  };

  if (!ref || !status) {
    return NextResponse.json(
      { message: 'Missing ref or status' },
      { status: 400 }
    );
  }

  if (!Object.values(EStatus).includes(status)) {
    return NextResponse.json({ message: 'Invalid status' }, { status: 400 });
  }

  try {
    console.log(`Updating invitation ${ref} to status ${status}`);

    updateInvitationStatus(ref, status);

    // Assuming the update was successful
    return NextResponse.json(
      { message: 'Invitation status updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating invitation status:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
};
