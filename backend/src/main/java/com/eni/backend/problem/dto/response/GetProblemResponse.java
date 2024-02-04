package com.eni.backend.problem.dto.response;

import com.eni.backend.problem.entity.Problem;
import com.eni.backend.problem.entity.Testcase;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

import java.util.List;

@ToString
@Getter
public class GetProblemResponse {

    private Long problemId;
    private String tier;
    private String platform;
    private Integer no;
    private String title;
    private String description;
    private String input;
    private String output;
    private String time;
    private String memory;
    private List<GetExampleResponse> examples;

    @Builder
    private GetProblemResponse(Long problemId, String tier, String platform, Integer no, String title, String description, String input, String output, String time, String memory, List<GetExampleResponse> examples) {
        this.problemId = problemId;
        this.tier = tier;
        this.platform = platform;
        this.no = no;
        this.title = title;
        this.description = description;
        this.input = input;
        this.output = output;
        this.time = time;
        this.memory = memory;
        this.examples = examples;
    }

    public static GetProblemResponse of(Problem problem, List<GetExampleResponse> examples) {
        return builder()
                .problemId(problem.getId())
                .tier(problem.getStringTier())
                .platform(problem.getStringPlatform())
                .no(problem.getNo())
                .title(problem.getTitle())
                .description(problem.getDescription())
                .input(problem.getInput())
                .output(problem.getOutput())
                .time(problem.getStringTime())
                .memory(problem.getStringMemory())
                .examples(examples)
                .build();
    }

}
