/**
 * AI API Route
 * 
 * Handles AI-related API requests including content analysis, threat detection,
 * and intelligent recommendations.
 */

import { NextRequest, NextResponse } from 'next/server';
import { aiAgentsService } from '@/services/ai-agents';
import { atsSystemService } from '@/services/ats-system';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'agents':
        const agents = await aiAgentsService.getAgents();
        return NextResponse.json({ success: true, data: agents });

      case 'agent-metrics':
        const agentId = searchParams.get('agentId');
        if (!agentId) {
          return NextResponse.json(
            { success: false, error: 'Agent ID is required' },
            { status: 400 }
          );
        }
        const metrics = await aiAgentsService.getAgentMetrics(agentId);
        return NextResponse.json({ success: true, data: metrics });

      case 'ats-analytics':
        const analytics = await atsSystemService.getAnalytics();
        return NextResponse.json({ success: true, data: analytics });

      case 'job-postings':
        const jobs = await atsSystemService.getJobPostings();
        return NextResponse.json({ success: true, data: jobs });

      case 'candidates':
        const candidates = await atsSystemService.getCandidates();
        return NextResponse.json({ success: true, data: candidates });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action parameter' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('AI API GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'analyze-content':
        const { content, contentType, analysisType, options } = body;
        
        if (!content || !analysisType) {
          return NextResponse.json(
            { success: false, error: 'Content and analysis type are required' },
            { status: 400 }
          );
        }

        const analysisResult = await aiAgentsService.analyzeContent({
          content,
          contentType: contentType || 'text',
          analysisType,
          options,
        });

        return NextResponse.json({ success: true, data: analysisResult });

      case 'detect-threats':
        const { content: threatContent, contentType: threatContentType } = body;
        
        if (!threatContent) {
          return NextResponse.json(
            { success: false, error: 'Content is required for threat detection' },
            { status: 400 }
          );
        }

        const threatResult = await aiAgentsService.detectThreats(
          threatContent,
          threatContentType || 'text'
        );

        return NextResponse.json({ success: true, data: threatResult });

      case 'update-agent-status':
        const { agentId, status } = body;
        
        if (!agentId || !status) {
          return NextResponse.json(
            { success: false, error: 'Agent ID and status are required' },
            { status: 400 }
          );
        }

        const updated = await aiAgentsService.updateAgentStatus(agentId, status);
        
        if (!updated) {
          return NextResponse.json(
            { success: false, error: 'Agent not found' },
            { status: 404 }
          );
        }

        return NextResponse.json({ success: true, data: { updated: true } });

      case 'create-job-posting':
        const jobData = body.jobData;
        
        if (!jobData) {
          return NextResponse.json(
            { success: false, error: 'Job data is required' },
            { status: 400 }
          );
        }

        const newJob = await atsSystemService.createJobPosting(jobData);
        return NextResponse.json({ success: true, data: newJob });

      case 'create-candidate':
        const candidateData = body.candidateData;
        
        if (!candidateData) {
          return NextResponse.json(
            { success: false, error: 'Candidate data is required' },
            { status: 400 }
          );
        }

        const newCandidate = await atsSystemService.createCandidate(candidateData);
        return NextResponse.json({ success: true, data: newCandidate });

      case 'submit-application':
        const applicationData = body.applicationData;
        
        if (!applicationData) {
          return NextResponse.json(
            { success: false, error: 'Application data is required' },
            { status: 400 }
          );
        }

        const application = await atsSystemService.submitApplication(applicationData);
        return NextResponse.json({ success: true, data: application });

      case 'find-matching-candidates':
        const { jobId, limit } = body;
        
        if (!jobId) {
          return NextResponse.json(
            { success: false, error: 'Job ID is required' },
            { status: 400 }
          );
        }

        const matches = await atsSystemService.findMatchingCandidates(jobId, limit);
        return NextResponse.json({ success: true, data: matches });

      case 'search-candidates':
        const { query, searchLimit } = body;
        
        if (!query) {
          return NextResponse.json(
            { success: false, error: 'Search query is required' },
            { status: 400 }
          );
        }

        const searchResults = await atsSystemService.searchCandidates(query, searchLimit);
        return NextResponse.json({ success: true, data: searchResults });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action parameter' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('AI API POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'update-job-posting':
        const { jobId, updates } = body;
        
        if (!jobId || !updates) {
          return NextResponse.json(
            { success: false, error: 'Job ID and updates are required' },
            { status: 400 }
          );
        }

        const updatedJob = await atsSystemService.updateJobPosting(jobId, updates);
        
        if (!updatedJob) {
          return NextResponse.json(
            { success: false, error: 'Job posting not found' },
            { status: 404 }
          );
        }

        return NextResponse.json({ success: true, data: updatedJob });

      case 'update-candidate':
        const { candidateId, candidateUpdates } = body;
        
        if (!candidateId || !candidateUpdates) {
          return NextResponse.json(
            { success: false, error: 'Candidate ID and updates are required' },
            { status: 400 }
          );
        }

        const updatedCandidate = await atsSystemService.updateCandidate(candidateId, candidateUpdates);
        
        if (!updatedCandidate) {
          return NextResponse.json(
            { success: false, error: 'Candidate not found' },
            { status: 404 }
          );
        }

        return NextResponse.json({ success: true, data: updatedCandidate });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action parameter' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('AI API PUT error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'job-posting':
        const jobId = searchParams.get('jobId');
        
        if (!jobId) {
          return NextResponse.json(
            { success: false, error: 'Job ID is required' },
            { status: 400 }
          );
        }

        // Note: Delete functionality would need to be implemented in atsSystemService
        return NextResponse.json(
          { success: false, error: 'Delete functionality not implemented' },
          { status: 501 }
        );

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action parameter' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('AI API DELETE error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}