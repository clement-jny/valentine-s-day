import { NextRequest, NextResponse } from 'next/server';
import { updateInvitationStatus } from '@/actions/invite';
import { EStatus } from '@/types/invite';
import { type TApiCall } from '@/types/api-call';

type TInviteStatusPatchBody = {
  ref: string;
  status: keyof typeof EStatus;
};

export const PATCH = async (
  request: NextRequest
): Promise<NextResponse<TApiCall>> => {
  const body = (await request.json()) as TInviteStatusPatchBody;
  const { ref, status } = body;

  if (!ref || !status) {
    return NextResponse.json(
      { success: false, message: 'Missing ref or status' },
      { status: 400 }
    );
  }

  if (!Object.values(EStatus).includes(status)) {
    return NextResponse.json(
      { success: false, message: 'Invalid status' },
      { status: 400 }
    );
  }

  try {
    console.log(`Updating invitation ${ref} to status ${status}`);

    updateInvitationStatus(ref, status);

    // Assuming the update was successful
    return NextResponse.json(
      { success: true, message: 'Invitation status updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating invitation status:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
};
